-- Enable Realtime on the messages table so the chat thread receives live inserts.
alter publication supabase_realtime add table public.messages;
