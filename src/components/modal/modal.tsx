import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

  import { ReactNode } from "react";

export interface ModalProps {
  /** Function to call when the primary action button is clicked */
  handleClick?: () => void;

  /** Title text displayed at the top of the modal */
  titleText?: string;

  /** Description text displayed below the title */
  descriptionText?: string;

  /** Optional icon to display in the modal */
  Icon?: ReactNode;

  /** Text for the primary action button */
  primaryButtonText?: string;

  /** Text for the secondary/cancel button */
  secondaryButtonText?: string;
}




  export function Modal({
    handleClick,
    titleText = "Are you absolutely sure?",
    descriptionText = "This action cannot be undone.",
    Icon,
    primaryButtonText = "Confirm",
    secondaryButtonText = "Cancel",
  }: ModalProps){
    return (
        <AlertDialog>
    <AlertDialogTrigger asChild>
        {/* Icon will be displayed as a clickable element */}
        <button className="flex items-center gap-2 text-primary">
          {Icon && <span>{Icon}</span>}
    
        </button>
      </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleClick}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    )
  }