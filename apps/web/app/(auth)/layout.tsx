export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          NetAtlas
        </p>
      </div>
      {children}
    </main>
  );
}
