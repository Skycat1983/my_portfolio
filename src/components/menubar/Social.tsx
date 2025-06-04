export const Social = ({
  imgPath,
  link,
}: {
  imgPath: string;
  link: string;
}) => {
  return (
    <div className="w-6 h-6">
      <a href={link} target="_blank" rel="noopener noreferrer">
        <img src={imgPath} alt="social" />
      </a>
    </div>
  );
};
