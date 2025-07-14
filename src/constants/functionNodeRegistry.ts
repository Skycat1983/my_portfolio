export const NODE_FUNCTION_REGISTRY = {
  test: () => {
    console.log("test");
  },
  emailMe: () => {
    const email = "hlaoutaris@gmail.com";
    const subject = "When can you start?";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailtoLink;
  },
};

export const getNodeFunction = (
  functionKey: keyof typeof NODE_FUNCTION_REGISTRY
) => {
  return NODE_FUNCTION_REGISTRY[functionKey];
};
