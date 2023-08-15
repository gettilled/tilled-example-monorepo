export interface ITilledFieldOptions {
    fieldOptions?: { styles?: { base?: { fontFamily?: string, color?: string, fontWeight?: string, fontSize?: string } } };
    onFocus(field: { element: Element }): void;
    onBlur(field: { element: Element, empty: boolean }): void;
}

export const TilledFieldOptions = {
    fieldOptions: {
        styles: {
            base: {
                fontFamily:
                    '-apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                color: '#304166',
                fontWeight: '400',
                fontSize: '16px',
            },
            invalid: {
                ':hover': {
                    textDecoration: 'underline dotted red',
                },
                color: '#777777',
            },
            valid: {
                color: '#32CD32',
            },
        },
    },
    onFocus(field: { element: Element }) {
        const element = field.element;
        const label = element.nextElementSibling;

        element.classList.add('border-slate-700');
        element.classList.add('border-2');
        label?.classList.add('text-slate-700');
        label?.classList.add('top-0');
        label?.classList.add('text-xs');

        element.classList.remove('border-zinc-300');
        element.classList.remove('border');
        element.classList.remove('hover:border-zinc-500');
        label?.classList.remove('text-zinc-600');
        label?.classList.remove('top-1/2');
    },
    onBlur(field: { element: Element, empty: boolean }) {
        const { element, empty } = field;
        const label = element.nextElementSibling;

        element.classList.add('border-zinc-300');
        element.classList.add('border');
        element.classList.add('hover:border-zinc-500');
        label?.classList.add('text-zinc-600');

        element.classList.remove('border-slate-700');
        element.classList.remove('border-2');
        label?.classList.remove('text-slate-700');

        if (empty) {
            label?.classList.add('top-1/2');
            label?.classList.remove('top-0');
            label?.classList.remove('text-xs');
        }
    },
};
