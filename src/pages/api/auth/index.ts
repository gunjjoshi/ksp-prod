import type { NextApiRequest, NextApiResponse } from 'next'
import { adminAuth } from '../../../utils/firebaseAdminInit'
import { firestore } from '../../../utils/firebaseInit'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'

export default async function authHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader('Access-Control-Allow-Origin', 'https://ksp-prod.vercel.app') // Replace with your frontend domain
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    const { method, headers } = req

    switch (method) {
        case 'GET':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1]

                try {
                    const user = await adminAuth.verifyIdToken(accessToken!)
                    const { email, name, uid, isAdmin } = user

                    const usersCollection = collection(firestore, 'users')
                    const userQuery = await getDocs(usersCollection)
                    const existingUser = userQuery.docs.find(
                        (doc) => doc.data().user_id === uid
                    )

                    if (!existingUser) {
                        await setDoc(doc(usersCollection, uid), {
                            user_id: uid,
                            email: email as string,
                            name,
                            isAdmin: user.isAdmin || false,
                        })
                    } else {
                        const existingAdminStatus = existingUser.data().isAdmin
                        res.status(200).json({
                            message: 'User fetched',
                            result: { ...user, isAdmin: existingAdminStatus },
                        })
                        return
                    }
                } catch (err: any) {
                    res.status(405).json({
                        err,
                    })
                }
            }
            break
        default:
            res.status(405).json({
                message: 'Method Not Allowed',
            })
    }
}
