import { Helmet } from 'react-helmet-async';
import NavigationBar from "@/components/NavigationBar"
import { SigninForm } from "@/components/SigninForm"

function Signin() {
    return(
    <div>
        <Helmet>
            <title>Logg inn — SarjoMat</title>
            <meta name="robots" content="noindex" />
        </Helmet>
        <NavigationBar />
                <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-sm">
                        <SigninForm />
                    </div>
                </div>
    </div>
    )
}

export default Signin