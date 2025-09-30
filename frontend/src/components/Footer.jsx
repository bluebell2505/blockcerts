// src/components/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-dark text-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Qdemy</h3>
            <p className="text-sm">
              Empowering your learning journey with world-class events and
              courses.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-primary-500">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-500">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-500">
                  About Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-sm">contact@qdemy.com</p>
            <p className="text-sm">+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>© 2024 Qdemy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;