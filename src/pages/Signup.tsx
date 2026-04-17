import { Helmet } from 'react-helmet-async';
import NavigationBar from '@/components/NavigationBar'
import { SignupForm } from '@/components/signup-form'

const Signup = () => {
    return(
    <div>
        <Helmet>
            <title>Registrer deg — SarjoMat</title>
            <meta name="robots" content="noindex" />
        </Helmet>
        <NavigationBar />
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <SignupForm />
            </div>
        </div>
    </div>
    )
}

export default Signup