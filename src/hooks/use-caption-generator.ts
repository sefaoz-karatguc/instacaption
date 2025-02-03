import { useState } from 'react';
import { generateCaption } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface CaptionGeneratorResult {
  loading: boolean;
  error: string | null;
  generateCaptionForImage: (file: File, customPrompt?: string) => Promise<void>;
  caption: string | null;
}

export function useCaptionGenerator(): CaptionGeneratorResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>(null);

  const uploadToSupabase = async (file: File): Promise<string> => {
    // Create a unique file name to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Error uploading file: ${uploadError.message}`);
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('files')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const generateCaptionForImage = async (file: File, customPrompt?: string) => {
    try {
      setLoading(true);
      setError(null);

      const toastId = toast.loading('Generating your caption...', {
        dismissible: true,
      });

      // Convert file to base64 for Gemini AI
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

      // Generate caption using Gemini
      const result = await generateCaption(base64, customPrompt);

      if (!result.success || !result.caption) {
        throw new Error(result.error || 'Failed to generate caption');
      }

      setCaption(result.caption);
      toast.dismiss(toastId);
      
      const uploadToastId = toast.loading('Uploading image...', {
        dismissible: true,
      });

      // Upload file to Supabase Storage
      const publicUrl = await uploadToSupabase(file);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Get client IP (this will be null on client side, will be set by server)
      let userIp = null;
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        userIp = data.ip;
      } catch (error) {
        console.error('Error getting IP:', error);
      }

      // Save to Supabase database
      const { error: insertError } = await supabase
        .from('posts')
        .insert({
          caption: result.caption,
          user_id: user?.id,
          user_ip: userIp,
          uploads: [publicUrl],
        });

      if (insertError) {
        // If database insert fails, try to delete the uploaded file
        await supabase.storage
          .from('files')
          .remove([file.name]);
        
        throw new Error(`Error saving to database: ${insertError.message}`);
      }

      toast.dismiss(uploadToastId);
      toast.success('Caption generated successfully!', {
        duration: 3000,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`, {
        duration: 5000,
      });
      console.error('Error in caption generation:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateCaptionForImage,
    caption,
  };
}
