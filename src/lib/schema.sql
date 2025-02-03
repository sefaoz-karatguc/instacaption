-- Create posts table
create table posts (
    id bigint primary key generated always as identity,
    caption text not null,
    user_ip text,
    user_id uuid,
    uploads text[], -- Array of text for storing multiple upload URLs/paths
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create an index on user_id for faster lookups
create index posts_user_id_idx on posts(user_id);

-- Function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at timestamp
create trigger update_posts_updated_at
    before update on posts
    for each row
    execute function update_updated_at_column();

-- Create visitors table
create table visitors (
    id bigint primary key generated always as identity,
    ip_address text not null,
    user_agent text,
    first_visit_at timestamp with time zone default timezone('utc'::text, now()),
    last_visit_at timestamp with time zone default timezone('utc'::text, now()),
    visit_count integer default 1,
    country text,
    city text,
    browser text,
    os text,
    device_type text,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create an index on ip_address for faster lookups
create index visitors_ip_address_idx on visitors(ip_address);

-- Create a function to update visitor information
create or replace function update_visitor_last_visit()
returns trigger as $$
begin
    new.last_visit_at = timezone('utc'::text, now());
    new.visit_count = old.visit_count + 1;
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create a trigger for updating visitor information
create trigger update_visitor_info
    before update on visitors
    for each row
    execute function update_visitor_last_visit();
