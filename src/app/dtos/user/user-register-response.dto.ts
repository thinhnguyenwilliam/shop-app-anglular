export interface UserRegisterResponseDto {
    id: number;
    phone_number: string;
    email: string;
    fullname: string;
    role_id: number;
    created_at: string;
    // Add more fields as returned by your backend
}
