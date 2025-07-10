interface CaptchaHeaderProps {
  //   title: string;
  task: string;
  text: string | null;
  width: string;
}

export const CaptchaHeader = ({
  //   title,
  task,
  text,
}: // width,
CaptchaHeaderProps) => {
  return (
    <div className={`bg-blue-500 p-8 w-full text-left`}>
      <p className="text-lg md:text-xl font-medium">{task}</p>
      <h2 className="text-2xl md:text-4xl font-bold h-18">{text}</h2>
    </div>
  );
};
