import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

interface Props {
    subjectCode: string
    semester: string
    subjectName: string
    instructorName: string
    resourceNumber:number,
    description:string,
    resourceType: string
    branch: string
    url: string
    uploadedBy: string
    isAnonymous: boolean
    refetch: Function
}

export const addPyq = ({
    subjectCode,
    semester,
    subjectName,
    resourceType,
    resourceNumber,
    description,
    instructorName,
    branch,
    uploadedBy,
    url,
    isAnonymous,
    refetch,
}: Props) => {
    toast.promise(
        api.post('/api/db/pyqs', {
            subjectCode,
            semester,
            subjectName,
            instructorName,
            description,
            resourceNumber,
            resourceType,
            uploadedBy,
            branch,
            url,
            isAnonymous,
        }),
        {
            loading: 'Adding...',
            success: (res) => {
                refetch()
                return `${res.data.message}`
            },
            error: (err) => `Error: ${err.message}`,
        }
    )
}