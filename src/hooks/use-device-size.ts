import { useEffect, useState } from "react"

 export const useDeviceSize = () => {
    const [deviceType, setDeviceType] = useState<"mobile" |"tablet" | "pc">()
    useEffect(() => {
      if(window.innerWidth ){
        
      }
    }, [])
    
 }