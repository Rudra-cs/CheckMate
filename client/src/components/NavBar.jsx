import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="sticky top-0 z-10 bg-slate-800 backdrop-filter backdrop-blur-lg bg-opacity-30 border-b border-gray-200">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <span className="text-xl text-gray-900 font-semibold">
                        Checkmate
                    </span>
                    <div className="flex space-x-4 text-gray-900">
                        <Link to={"/"}>Create Room</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
