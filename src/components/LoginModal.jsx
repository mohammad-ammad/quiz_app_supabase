import { Modal } from "flowbite-react";
import { useContext} from "react";
import GlobalContext from "../context/GlobalContext";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../utils/config";

function LoginModal() {
  const { openModal, onCloseModal } = useContext(GlobalContext);

  return (
    <>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Sign in to our platform
            </h3>
            <Auth
              supabaseClient={supabase}
              providers={["google", "apple"]}
              appearance={{ theme: ThemeSupa }}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default LoginModal;
