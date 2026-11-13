import PostLoginSplash from "@/components/splash/PostLoginSplash";

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* El panel carga debajo mientras corre el splash post-login */}
      <PostLoginSplash />
    </>
  );
}
