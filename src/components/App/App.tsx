import "./App.css";

function App({ children }: { children: React.ReactNode }) {
  return <div className="app">{children}</div>;
}

function Header({ children }: { children: React.ReactNode }) {
  return <header className="app__header">{children}</header>;
}
function Main({ children }: { children: React.ReactNode }) {
  return <main className="app__main">{children}</main>;
}
function Footer({ children }: { children: React.ReactNode }) {
  return <footer className="app__footer">{children}</footer>;
}

Object.assign(App, {
  Header,
  Main,
  Footer,
});

export default App;
