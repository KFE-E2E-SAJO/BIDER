import { getRandomImage } from '@/features/lib/random';

export default function Person({
  index,
  userId,
  name,
  onlineAt,
  isActive,
  onChatScreen,
}: {
  index: number;
  userId: string;
  name: string;
  onlineAt: string;
  isActive: boolean;
  onChatScreen: boolean;
}) {
  return (
    <div
      className={`flex items-center p-4 ${isActive && 'bg-light-blue-200'} ${onChatScreen ? 'bg-gray-500' : 'bg-light-blue-50'}`}
    >
      <img src={getRandomImage(index)} alt={name} className="h-4 w-4 rounded-full" />
      <div>
        <p className="text-lg font-bold text-black">{name}</p>
        <p className="text-gray-500">{onlineAt}</p>
      </div>
    </div>
  );
}
