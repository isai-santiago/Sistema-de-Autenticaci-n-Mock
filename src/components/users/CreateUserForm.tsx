// components/users/CreateUserForm.tsx
import { createUser } from '@/lib/actions/users';
import { useFormState } from 'react-dom';

export function CreateUserForm() {
    const initialState = { message: undefined, errors: {} };
    
    const action = async (prevState: any, formData: FormData) => {
        return await createUser(formData);
    };
    
    const [state, dispatch] = useFormState(action, initialState);

    return (
        <form action={dispatch} className="space-y-4">
            <div>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    aria-describedby="name-error"
                />
                <div id="name-error" aria-live="polite">
                    {state.errors?.name && (
                        <p className="text-red-500 text-sm">
                            {state.errors.name}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    aria-describedby="email-error"
                />
                <div id="email-error" aria-live="polite">
                    {state.errors?.email && (
                        <p className="text-red-500 text-sm">
                            {state.errors.email}
                        </p>
                    )}
                </div>
            </div>

            <button type="submit">
                Create User
            </button>
        </form>
    );
}