
import Link from 'next/link'
import CartButton from './cart-button'

export default function Menu() {
  return (
    <div className='flex justify-end'>
      <nav className='flex gap-3 w-full'>
        <Link href='/cart' className='header-button flex items-center '>
          {/* <UserIcon className='h-8 w-8' /> */}
         Hello, Sign in
        </Link>
        <CartButton />
      </nav>
    </div>
  )
}