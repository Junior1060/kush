// Faux iOS status bar — matches the prototype's clock + signal + battery.
export function StatusBar() {
  return (
    <div className="flex h-[54px] flex-none items-end justify-between px-[30px] pb-[9px]">
      <span className="text-[15px] font-bold tracking-[0.2px] text-ink">9:41</span>
      <div className="flex items-center gap-[7px]">
        <div className="flex h-[11px] items-end gap-[2px]">
          <div className="h-[5px] w-[3px] rounded-[1px] bg-ink" />
          <div className="h-[7px] w-[3px] rounded-[1px] bg-ink" />
          <div className="h-[9px] w-[3px] rounded-[1px] bg-ink" />
          <div className="h-[11px] w-[3px] rounded-[1px] bg-ink" />
        </div>
        <div className="relative h-[12px] w-[24px] rounded-[3px] border-[1.5px] border-ink p-[1.5px]">
          <div className="h-full w-[75%] rounded-[1px] bg-ink" />
          <div className="absolute right-[-3px] top-[3.5px] h-[5px] w-[2px] rounded-r-[1px] bg-ink" />
        </div>
      </div>
    </div>
  );
}
