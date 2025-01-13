export const formatDateMMDDYYYY = (date: Date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

export const formatDate = (isoDateString: any) => {
  const date = new Date(isoDateString);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

export const formatDateWithTime = (createdAt: any) => {
  const date = new Date(createdAt);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  // Format date part
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  const formattedDate = date.toLocaleDateString('en-US', options);

  return `${hours}:${minutes} ${ampm} | ${formattedDate}`;
};

export const eighteenYearsAgeChcek = new Date();
eighteenYearsAgeChcek.setFullYear(eighteenYearsAgeChcek.getFullYear() - 18);

export const hundredYearsAgeChcek = new Date();
hundredYearsAgeChcek.setFullYear(hundredYearsAgeChcek.getFullYear() - 100);

export const subscriptionDateModified = (billingDate: any) => {
  const date = new Date(billingDate);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';

  // Convert 24-hour format to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12;

  // Construct the formatted date and time string
  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
};
