export const GeneralError = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background'>
      <div className='space-y-4 text-center'>
        <h1 className='text-4xl font-bold'>500</h1>
        <p className='text-2xl font-semibold'>Internal Server Error</p>
        <p className='text-muted-foreground'>
          Something went wrong. Please try again later.
        </p>
      </div>
    </div>
  )
}
