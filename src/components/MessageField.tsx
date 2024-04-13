import { TextField } from "@tw/TextField";


export function MessageField({
                               error,
                               helper,
                               recipient,
                               setRecipient,
                               locked,
                             }) {

  return (
    <TextField
      className="font-telegrama"
      placeholder="Enter the receiving address here."
      value={recipient}
      onChange={(event) => {
        setRecipient(event.target.value);
      }}
      disabled={locked}
      helperText={helper}
      error={error}
    />
  );
}

