export const MaintenanceError = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background'>
      <div className='space-y-4 text-center'>
        <h1 className='text-4xl font-bold'>503</h1>
        <p className='text-2xl font-semibold'>Service Unavailable</p>
        <p className='text-muted-foreground'>
          We're currently under maintenance. Please try again later.
        </p>
      </div>
    </div>
  )
}
