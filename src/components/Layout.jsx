import Navbar from './Navbar'; // Import the Navbar component

const Layout = ({ children }) => {
  // Define approximate footer height to prevent content overlap.
  // Footer has 1rem top/bottom padding + paragraph height (approx 1.5rem). Total ~3.5rem.
  // We'll use 4rem for main's paddingBottom to give a little extra space.
  const mainPaddingBottom = '4rem';

  return (
    <>
      {/* Render the Navbar component */}
      <Navbar />
      {/* The main content area where routed components will render */}
      <main style={{ paddingBottom: mainPaddingBottom }}>{children}</main>

      {/* Your footer */}
      <footer style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: 'white', // Consistent with Navbar background
        borderTop: '1px solid #dee2e6', // Subtle top border
        textAlign: 'center',
        padding: '1rem 0', // 1rem top and bottom padding
        zIndex: 1020 // Ensure it's above most content, but below modals if any
      }}>
        <p style={{ margin: 0 }}>&copy; 2024 International Bank</p>
      </footer>
    </>
  );
};

export default Layout;
