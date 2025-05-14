const Layout = ({ children }) => {
  return (
    <>
      {/* Your header, navigation, etc. */}
      <header>
        <h2>International Bank</h2>
        {/* Navigation links */}
      </header>

      {/* The main content area where routed components will render */}
      <main>{children}</main>

      {/* Your footer */}
      <footer>
        <p>&copy; 2024 International Bank</p>
      </footer>
    </>
  );
};

export default Layout;
