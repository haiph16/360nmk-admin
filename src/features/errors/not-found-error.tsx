export const NotFoundError = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background'>
      <div className='space-y-4 text-center'>
        <h1 className='text-4xl font-bold'>404</h1>
        <p className='text-2xl font-semibold'>Page Not Found</p>
        <p className='text-muted-foreground'>
          The page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  )
}
