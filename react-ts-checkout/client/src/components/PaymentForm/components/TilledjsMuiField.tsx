import {
    FontAwesomeIcon,
    FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

export default function TilledMuiField(props: {
    id: string;
    label: string;
    inputRef: React.MutableRefObject<null>;
    cardCaptureRef?: React.MutableRefObject<null>;
}) {
    const { id, label, inputRef, cardCaptureRef } = props;
    const elIdPrefix =
        'tilled-mui-field_' + label.replace(' ', '-').toLowerCase();

    return (
        <div id={elIdPrefix + '_container'} className='relative group'>
            <div
                id={id}
                className=' outline-0 h-14 hover:border-zinc-500 rounded border border-zinc-300 pt-4 pb-4 pl-3 w-full'
                ref={inputRef}
            />
            {/* <div id="card-brand-icon" /> */}
            <span
                id={elIdPrefix + '_span'}
                className='absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600 bg-white ml-2 pl-1 transition-all duration-100 ease-out origin-top-left pointer-events-none'
            >
                {label}
            </span>
            {cardCaptureRef ? (
                <div
                    className='absolute right-2 top-1/2 -translate-y-1/2'
                    ref={cardCaptureRef}
                    hidden
                >
                    <FontAwesomeIcon
                        icon={faCamera}
                        ref={cardCaptureRef}
                        className='w-6 h-6 text-zinc-600 m-auto'
                    />
                </div>
            ) : (
                ''
            )}
        </div>
    );
}
