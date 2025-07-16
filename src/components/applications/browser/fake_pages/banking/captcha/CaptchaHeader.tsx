interface CaptchaHeaderProps {
  //   title: string;
  task: string;
  text: string | null;
  width: string;
}

export const CaptchaHeader = ({ task, text }: CaptchaHeaderProps) => {
  return (
    <div
      className="
        bg-blue-500
        w-full
                    /* 12rem tall */
        max-w-sm
        flex
        justify-start /* left align horizontally */
        items-center   /* left align vertically */
        p-8
      "
    >
      <div className="text-left text-white">
        <p className="text-lg md:text-xl font-medium">{task}</p>
        <h2 className="text-2xl md:text-4xl font-bold">{text}</h2>
      </div>
    </div>
  );
};
