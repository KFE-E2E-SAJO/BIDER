import { LoaderCircle } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <LoaderCircle size={40} className="text-main animate-spin" />
    </div>
  );
};

export default Loading;
