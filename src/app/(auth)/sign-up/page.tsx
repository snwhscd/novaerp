import { Suspense } from 'react'

import { SignUpForm } from '@/features/auth/presentation/components/sign-up-form'

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  )
}
