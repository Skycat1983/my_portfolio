interface DocumentFooterProps {
  content: string;
}

export const DocumentFooter = ({ content }: DocumentFooterProps) => {
  const wordCount = content
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const charCount = content.length;

  return (
    <div className="bg-gray-50 border-t border-gray-300 px-4 py-2">
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
        <div>Document Editor</div>
      </div>
    </div>
  );
};
