import "../styles/loadingscreen.scss";

interface LoadingScreenProps {
    text?: string;
}

const LoadingScreen = ({ text }: LoadingScreenProps) => {
    return (
        <main>
            <div className="loading-screen">
                <div className="loader" />
                {text && <p>{text}</p>}
            </div>
        </main>
    );
};

export default LoadingScreen;