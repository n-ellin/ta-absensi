import { FadeArc } from "../Spinner/fade-arc";

const PageLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <FadeArc className="size-15 text-[#282333]" />
    </div>
  );
};

export default PageLoader;
