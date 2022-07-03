import { useSession } from "next-auth/react";

function AccountPage({}) {
  const { data: session, status } = useSession();

  console.log(session);

  if (status === "loading" || status === "unauthenticated" || !session)
    return <div>unauthenticated!</div>;

  return (
    <div>
      <p className="text-xl text-center w-fit h-2">
        Hei <b className="font-semibold">{session.user?.name}</b>!
        <div className="flex grow ">{session?.user?.email}</div>
      </p>
    </div>
  );
}

export default AccountPage;
