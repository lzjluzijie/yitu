import { GetServerSidePropsContext } from "next"
import BASE58 from "../lib/base58"

const Redirector = () => <></>

export default Redirector

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  if (context.params !== undefined) {
    const { id } = context?.params
    if (typeof id === "string" && id.length === 5) {
      const n = BASE58.decodeInt(id)
      if (!isNaN(n)) {
        console.log(n)
        return {
          redirect: {
            permanent: false,
            destination: id,
          },
        }
      }
    }
  }

  return {
    notFound: true,
  }
}
