import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getConversationByMatch, getMessages } from "@/lib/queries";
import { ChatThread } from "@/components/chat/ChatThread";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const conversation = await getConversationByMatch(supabase, user.id, matchId);
  if (!conversation) notFound();

  const messages = await getMessages(supabase, matchId);

  return (
    <ChatThread
      matchId={matchId}
      meId={user.id}
      profile={conversation.profile}
      initialMessages={messages}
    />
  );
}
