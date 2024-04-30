function LogOut() {
    const btn = (
        <button>
          Log out
        </button>
    );
    const isSignedIn = true; // Replace with SSO info

    return isSignedIn ? btn : null;
}
  
export default function NavBar() {
    return (
        <div>
            <h1>Frequent Callers</h1>
            <LogOut />
        </div>
    );
}