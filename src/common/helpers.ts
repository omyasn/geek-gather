export const formatToHumanDate = (date: string) => (
    new Date(date).toLocaleDateString(
        'en-gb',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      )
);