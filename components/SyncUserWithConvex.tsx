'use client'

import { useUser } from "@clerk/nextjs"


const SyncUserWithConvex = () => {

    const {user} = useUser();

    // const updateUser = useMutation(api.users.updateUser);

    useEffect(() => {
        if (!user) return;

        const syncUser = async () => {
            try {
                await updateUser({
                    userId: user.id,
                    name:user.fullName,
                    email: user.emailAddresses[0]?.emailAddress ?? ""
                });
            } catch (error) {
                console.error("Failed to sync user with Convex", error)
            }
        };
        syncUser();
    }, [user, updateUser]);

  return null;
}

export default SyncUserWithConvex