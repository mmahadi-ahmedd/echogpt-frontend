'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '@/lib/api/chat';
import { Message, ProviderName } from '@/types/chat';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: ({ message, provider }: { message: string; provider: ProviderName }) =>
      chatApi.sendMessage({ message, provider }),
    onSuccess: (data) => {
      setMessages((prev) => [...prev, data.userMessage, data.assistantMessage]);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      router.replace(`/chat/${data.conversationId}`);
    },
  });

  return (
    <div className="flex h-full flex-col">
      {messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-center opacity-60">
          <div>
            <h2 className="text-xl font-semibold">Start a new conversation</h2>
            <p className="mt-1 text-sm">Pick a provider below and send your first message.</p>
          </div>
        </div>
      ) : (
        <MessageList messages={messages} />
      )}
      <MessageInput
        onSend={(message, provider) => sendMessage({ message, provider })}
        isSending={isPending}
      />
    </div>
  );
}