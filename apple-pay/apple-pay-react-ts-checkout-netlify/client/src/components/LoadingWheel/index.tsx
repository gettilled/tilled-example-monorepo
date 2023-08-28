import './index.css';

function LoadingWheel() {
    return (
        <div className='flex flex-col items-center m-auto'>
            <div className='loading-wheel'>
                <div className='loader-content'>
                    <div></div>
                </div>
            </div>
        </div>
    );
}

export default LoadingWheel;
