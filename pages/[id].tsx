import { GetServerSidePropsContext } from "next"
import { DEFAULT_ID_LENGTH, Item } from "../lib/item"
import redis from "../lib/redis"

const Redirector = () => <></>

export default Redirector

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  if (context.params !== undefined) {
    const { id } = context?.params
    if (typeof id === "string" && id.length === DEFAULT_ID_LENGTH) {
      const data = await redis.get(id)
      if (data !== null) {
        const item: Item = JSON.parse(data)
        return {
          redirect: {
            permanent: false,
            destination: item.onedrive.directURL,
          },
        }
      }
    }
  }

  return {
    notFound: true,
  }
}
