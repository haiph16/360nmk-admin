export const UnauthorisedError = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background'>
      <div className='space-y-4 text-center'>
        <h1 className='text-4xl font-bold'>401</h1>
        <p className='text-2xl font-semibold'>Unauthorized</p>
        <p className='text-muted-foreground'>
          Please log in to access this resource.
        </p>
      </div>
    </div>
  )
}
