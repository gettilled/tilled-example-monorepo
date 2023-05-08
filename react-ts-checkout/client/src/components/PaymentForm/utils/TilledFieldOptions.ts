export interface ITilledFieldOptions {
    fieldOptions?: { styles?: { base?: { fontFamily?: string, color?: string, fontWeight?: string, fontSize?: string } } };
    onFocus?(field: { element: Element }): void;
    onBlur?(field: { element: Element, empty: boolean }): void;
    onError?(field: { element: Element }): void;
}

const baseStyles = {
    element: ['outline-0', 'h-14', 'rounded', 'pt-4', 'pb-4', 'pl-3', 'w-full'],
    label: ['absolute', 'left-0', '-translate-y-1/2', 'bg-white', 'ml-2', 'pl-1', 'transition-all', 'duration-100', 'ease-out', 'origin-top-left', 'pointer-events-none'],
}
const blurStyles = {
    element: ['border-zinc-300', 'border', 'hover:border-zinc-500'],
    label: ['text-zinc-600'],
};
const focusStyles = {
    element: ['border-slate-700', 'border-2'],
    label: ['text-slate-700', 'top-0', 'text-xs'],
};
const errorStyles = {
    element: ['border-red-500', 'border-2'],
    label: ['text-red-500', 'top-0', 'text-xs'],
};
const emptyStyles = {
    label: ['top-1/2'],
};

const applyBaseStyles = (element: Element, label: Element | null) => {
    element.classList.forEach(cl => {
        element.classList.remove(cl)
    });
    element.classList.add(...baseStyles.element);

    if (label) {
        label.classList.forEach(cl => {
            label.classList.remove(cl)
        })
        label.classList.add(...baseStyles.label);
    }
};


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

        applyBaseStyles(element, label);

        element.classList.add(...focusStyles.element);
        label?.classList.add(...focusStyles.label);
        // element.classList.add('border-slate-700');
        // element.classList.add('border-2');
        // label?.classList.add('text-slate-700');
        // label?.classList.add('top-0');
        // label?.classList.add('text-xs');

        // element.classList.remove('border-zinc-300');
        // element.classList.remove('border');
        // element.classList.remove('hover:border-zinc-500');
        // label?.classList.remove('text-zinc-600');
        // label?.classList.remove('top-1/2');
    },
    onBlur(field: { element: Element, empty: boolean }) {
        const { element, empty } = field;
        const label = element.nextElementSibling;

        applyBaseStyles(element, label);
        element.classList.add(...blurStyles.element);
        label?.classList.add(...blurStyles.label);

        if (empty) {
            label?.classList.add(...emptyStyles.label);
        }

        // element.classList.add('border-zinc-300');
        // element.classList.add('border');
        // element.classList.add('hover:border-zinc-500');
        // label?.classList.add('text-zinc-600');

        // element.classList.remove('border-slate-700');
        // element.classList.remove('border-2');
        // label?.classList.remove('text-slate-700');

        // if (empty) {
        //     label?.classList.add('top-1/2');
        //     label?.classList.remove('top-0');
        //     label?.classList.remove('text-xs');
        // }
    },
    onError(field: { element: Element }) {
        const element = field.element;
        const label = element.nextElementSibling;

        applyBaseStyles(element, label);
        element.classList.add(...errorStyles.element);
        label?.classList.add(...errorStyles.label);

        // element.classList.add('border-red-500');
        // element.classList.add('border-2');
        // label?.classList.add('text-red-500');
        // label?.classList.add('top-0');
        // label?.classList.add('text-xs');

        // element.classList.remove('border-slate-700');
        // element.classList.remove('border-2');
        // label?.classList.remove('text-slate-700');
        // label?.classList.remove('top-0');
        // label?.classList.remove('text-xs');
    }
};
