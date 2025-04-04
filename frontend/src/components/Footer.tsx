const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-6 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                {/* Left Side: Logo & Copyright */}
                <div className="flex items-center gap-3 mb-4 md:mb-0">
                    <svg
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="text-gray-400">
                        <path d="M12 0l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88L2 9.27l6.91-3.01L12 0z"></path>
                    </svg>
                    <p className="text-sm">
                        © {new Date().getFullYear()} AU Bus Track. All rights reserved.
                    </p>
                </div>

                {/* Right Side: Social Media Links */}
                <nav className="flex gap-5">
                    {[
                        {
                            href: "https://twitter.com",
                            label: "Twitter",
                            iconPath: "M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.46.4a9.08 9.08 0 01-2.83 1.08A4.52 4.52 0 0016.2 0c-2.53 0-4.6 2.07-4.6 4.6 0 .36.04.72.12 1.07A12.94 12.94 0 013 2.16a4.49 4.49 0 001.4 6.08A4.47 4.47 0 012.2 7.6v.06c0 2.17 1.54 3.99 3.58 4.4a4.52 4.52 0 01-2.08.08 4.57 4.57 0 004.28 3.18A9.05 9.05 0 010 19.54 12.79 12.79 0 006.92 21c8.29 0 12.83-6.87 12.83-12.84 0-.2 0-.39-.01-.58A9.18 9.18 0 0023 3z"
                        },
                        {
                            href: "https://youtube.com",
                            label: "YouTube",
                            iconPath: "M19.6 3H4.4C2.98 3 2 4 2 5.4v13.2C2 20 2.98 21 4.4 21h15.2c1.42 0 2.4-1 2.4-2.4V5.4C22 4 21.02 3 19.6 3zm-9.6 12.8V8l6.4 3.9-6.4 3.9z"
                        },
                        {
                            href: "https://facebook.com",
                            label: "Facebook",
                            iconPath: "M22 12a10 10 0 10-11 9.95V14h-3v-2h3V9.5A4.49 4.49 0 0115.5 5h2v2h-2a1.5 1.5 0 00-1.5 1.5V12h3.5l-.5 2h-3v7.95A10 10 0 0022 12z"
                        }
                    ].map(({ href, label, iconPath }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            className="transition-transform transform hover:scale-110 hover:text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="fill-gray-400 hover:fill-white transition"
                            >
                                <path d={iconPath}></path>
                            </svg>
                        </a>
                    ))}
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
