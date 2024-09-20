import Link from "next/link";
import person from '@/assets/images/person.jpg';
import lock from '@/assets/images/lock.jpg';
import logo from '@/assets/images/app-logo.jpg';
import Image from "next/image";

export default function SignIn() {
    return(
        <div className="w-full min-h-screen flex justify-center items-center">
            <section className="w-full md:w-4/5">
                <header className="mb-16 text-white text-center">
                    <h1 className="text-2xl font-bold">GUBAT TRANSPORT COOPERATIVE</h1>
                </header>
                <div className="w-full flex justify-center items-center gap-5 md:px-20">
                    <div className="w-full md:w-2/3 flex justify-start items-center">
                        <div className="overflow-hidden rounded-full w-auto">
                            <Image src={logo} alt="logo" priority={true} width={300} height={300} />
                        </div>
                    </div>
                    <form className="w-full md:w-1/3">
                        <div className="w-full space-y-4">
                            <div className="group w-full flex justify-center items-center bg-white p-2 rounded ring-2 focus-within:ring ring-black gap-2">
                                <label htmlFor="email" className="">
                                    <Image src={person} alt="person-icon" width={20} height={20} />
                                </label>
                                <input type="email" name="email" id="email" className="w-full px-2 outline-none border-l border-black" />
                            </div>
                            <div className="group w-full flex justify-center items-center bg-white p-2 rounded ring-2 focus-within:ring ring-black gap-2">
                                <label htmlFor="password" className="">
                                    <Image src={lock} alt="lock-icon" width={20} height={20} />
                                </label>
                                <input type="password" name="password" id="password" className="w-full px-2 outline-none border-l border-black" />
                            </div>
                            <button type="submit" className="p-2 w-full rounded bg-yellow-600 hover:bg-yellow-500 text-white font-bold">
                                LOG IN
                            </button>
                            <p className="text-center text-white"><Link className="font-bold hover:text-blue-400" href={'/forgot-password'}>Forgot Password?</Link></p>
                            <p className="text-center text-xs text-white">No account yet? <Link href={'/sign-up'} className="font-bold hover:text-blue-400">sign up</Link></p>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    )
}