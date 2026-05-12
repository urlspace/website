import "./App.css";

function App({ children }: { children: React.ReactNode }) {
  return <div className="app">{children}</div>;
}

function Header({ children }: { children: React.ReactNode }) {
  return <header className="app__header">{children}</header>;
}
function Main({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="app__main">
      {children}
    </main>
  );
}
function Footer({ children }: { children: React.ReactNode }) {
  return <footer className="app__footer">{children}</footer>;
}

App.Header = Header;
App.Main = Main;
App.Footer = Footer;

export default App;
