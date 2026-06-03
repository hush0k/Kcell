interface Props {
  message: string | null;
}

export function Toast({ message }: Props) {
  return (
    <div
      className={`fixed left-1/2 bottom-8 -translate-x-1/2 bg-ink text-white font-semibold text-[14.5px] px-[22px] py-[13px] rounded-full shadow-lg z-[90] transition-all duration-250 pointer-events-none ${
        message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      {message}
    </div>
  );
}
