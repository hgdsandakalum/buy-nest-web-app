import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-gray-800 hover:text-gray-600">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/products"
              className="text-gray-800 hover:text-gray-600"
            >
              Products
            </Link>
          </li>
          <li>
            <Link href="/orders" className="text-gray-800 hover:text-gray-600">
              Orders
            </Link>
          </li>
          <li>
            <Link href="/account" className="text-gray-800 hover:text-gray-600">
              Account
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
