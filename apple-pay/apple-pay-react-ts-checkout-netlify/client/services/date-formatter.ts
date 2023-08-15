export default function dateFormatter(dateString: string | number | Date) {
	const formatter = new Intl.DateTimeFormat('en-US', {
		dateStyle: 'medium',
		timeStyle: 'medium',
		timeZone: 'America/Denver',
	});
	return formatter.format(new Date(dateString));
}
